// js/script.js file

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var address = streetStr + ", " + cityStr;
    $greeting.text('So you want to live at ' + address + '?');
    var streetViewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address;
    $("body").append('<img class="bgimg" src="'+streetViewURL+'">');

    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=c0ce5b215e3b4e86ac8614c98bd6dca5'
    // passs into JSON the url that we created above, plus anonymous function (which will run once we get response back from nyt)
    $.getJSON(nytimesUrl, function(data) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        // iterate through the data object (which is what we receive back from nyt)
        // within the data object, grab the response portion and the docs that are a part of that
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            // get the article url and snippet
            $nytElem.append('<li class="article">' + '<a href="'+article.web_url+'">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        };
    })
    // handle errors in case no articles can be presented
    // error runs an anonymous function that takes in the actual error, "e"
    .error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded. Haha!');
    });

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    // error handling not built into jsonp, so instead we can set a timeout if the request runs for too long
    // then clear the timeout below if we were able to get data
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        // create url parameter and set it equal to the wikiurl parameter
        // we also could've done this as $.ajax(wikiUrl, {
        url: wikiUrl,
        // by default, setting jsonp as the datatype will set callback function name to 'callback', but here is where we would change it if we wanted it to be something else
        dataType: "jsonp",
        // jsonp: "callback",
        success: function( response ) {
            // response[1] looks at the array object that is returned from wikipedia
            var articleList = response[1];
            // then iterate through articelist
            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href ="' + url + '">' + articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);