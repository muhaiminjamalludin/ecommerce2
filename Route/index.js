
module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT id,title, type, year, author, image, language, institution, Publication, pages, edition, link, topic FROM `publication`"; // query database
        let titles = "iNaQ";
        // execute query
        db.query(query, (err, result) => {
            if (err) {
                console.log("error1")
                res.redirect('/');
            };
            res.render('index.ejs', {
                title: titles,
                publications: result
            });
        });
    },


};
