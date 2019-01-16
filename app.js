const express = require('express');
const cors = require('cors');
const app = express();
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json({limit:'50mb'})); 
app.use(express.urlencoded({extended:true, limit:'50mb'}));
app.get('/', (req,res) => {
    res.send("Hello From FBC API")
})


function analyze(body) {
    var finalRes = [];
    // adding arabic language.
    var arLanguage = {
        labels: { 
            'غالية': -1,
            'قفاصة': -1,
            'قفاصه': -1,
            'بحجمكم': -2,
            'مغلق': -1,
            'مغلقة': -1,
            'مغلقه': -1,
            'تعبان': -2,
            'خيالية': -2,
            'مداصدك': -2,
            'مداستوعب': -2,
            'حفاظات': -2,
            'ماكو': -1,
            'متردون': -1,
            'شكرا': 2,
            'شكراً': 2,
            'بالتوفيق': 2,
            'احسنتم': 2,
            'استمروا': 2,
            'مميز': 2,
            'طيبة': 2,
            'سعيدة': 2,
            'سعيد': 2,
            'سعداء': 2,
            'سعيدين': 2,
            'فخر': 2,
            'اعتزاز': 2,
            'الفخر': 2,
            'روعة': 2,
            'اروع': 2,
            'راقي': 2,
            'ممتاز': 2,
            'احبه': 2,
            'احبة': 2,
            'عظيم': 3,
            'محفز': 3,
            'مريح': 32
        },
        // scoringStrategy: {
        //     apply: function(tokens, cursor, tokenScore) {
        //         if(cursor >= 0) {
        //             // Negative keywords
        //             tokenScore = tokens[cursor] == 'ماكو' && tokens[cursor+1] == 'رد' ? tokenScore -= 1 : tokenScore;
        //             tokenScore -= tokens[cursor] == 'اسعارهم' || 'اسعاركم' && tokens[cursor+1] == 'غالية' ? tokenScore -= 1: tokenScore;
        //             tokenScore -= tokens[cursor] == 'صايرين' && tokens[cursor+1] == 'ميردون' || 'متردون' ? tokenScore -= 1: tokenScore;
        //         }
        //         return tokenScore;
        //     }
        // }
    };

    sentiment.registerLanguage('ar', arLanguage);

    console.log(Array.isArray(body));
    

    if(Array.isArray(body)) {
        body.map((comments) => { 
            console.log(comments.comment);
                       
            var result = sentiment.analyze(comments.comment, { language: 'ar'});
            result.score = result.score < -10 ? -10 : result.score > 10 ? 10 : result.score;
            result.keyword = result.score > 0 && result.score < 6 ? "جيد" : result.score > 5 ? "جيد جداً" : result.score < 0 && result.score > -5 ? "سيئ" : result.score == 0 ? "محايد" : "سيئ جدا";          
            
            finalRes.push({
                text: comments.comment,
                score: result.score,
                keyword: result.keyword
            });
        });
    }

    return finalRes;
}

app.post('/analyze' , (req,res)=>{
      var resp =  analyze(req.body.text);
      res.json(resp)
})

app.listen(PORT, ()=>{
    console.log(`Server Started Running On Port ${PORT}`)
})