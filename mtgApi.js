var app = new Vue({
    el: '#app',
    data: {
        message: 'MTG Card Name'
    }
});

var cardSearch = new Vue({
    el: '#cardSearch',
    data: {
        message: '',
        price: '',
        mkmURL: '',
        imgSRC: '',
        price30Day: '',
        price15Day: '',
        price1Day: '',
        priceFrom: ''
    },
    methods: {
        getCardInfo: function () {
            var q = this.message;
            getInfo(q);

        },
        getAllCard: function () {
            var q = this.message;
            getCardList(q);
        }
    }
});


function getInfo(q) {
    var that = this;
    var api = 'https://api.scryfall.com/cards/named?fuzzy=' + q;
    var x = new XMLHttpRequest();
    x.open('GET', api);
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.onload = function () {
        var result = JSON.parse(x.response);
        console.log(result);

        if (result.status === 404) {
            ons.notification.alert('Too many result');
        } else {

            if (result.status === 400) {
                ons.notification.alert('Error retriving card info');
            } else {
                that.getPrice(result.name);
                
                cardSearch.mkmURL = result.purchase_uris.cardmarket;
                cardSearch.imgSRC = result.image_uris.border_crop;
               let fixedSetName = result.set_name.replace(/\s/g, "-");
               let fixedName = result.name.replace(/,/g , "");
               fixedName =  fixedName.replace(/\s/g, "-");
               
               let urisMKM = "https://www.cardmarket.com/en/Magic/Products/Singles/"+fixedSetName+"/"+fixedName;
                that.getAllTrend(urisMKM);
            }
        }
    };
    x.send();
}



function getPrice(q) {
    var api = 'https://api.scryfall.com/cards/named?fuzzy=' + q;
    var x = new XMLHttpRequest();
    x.open('GET', api);
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.onload = function () {
        var result = JSON.parse(x.response);
        cardSearch.price = 'Price trend : ' + result.prices.eur + '\u20AC';
    };
    x.send();
}


function getCardList(q) {
    var that = this;
    var api = 'https://api.scryfall.com/cards/autocomplete?q=' + q;
    var x = new XMLHttpRequest();
    x.open('GET', api);

    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.onload = function () {
        var result = JSON.parse(x.response);
        for (var index in result.data) {
            let price = that.getCardPrice(result.data[index]);
            console.log(price);
        }
    };
    x.send();
}


function getAllTrend(qURL) {


    var proxyURL = 'https://cors-anywhere.herokuapp.com/';
    var api = proxyURL + qURL;
    var x = new XMLHttpRequest();
    x.open('GET', api);
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.onload = function () {
        console.log(x);
        var texts = $(x.response).find(".col-6.col-xl-5");
        var prices = $(x.response).find(".col-6.col-xl-7");
        console.log(texts);


        if (texts.length === 10) {
            var price30Day = texts[7].innerText + " " + prices[7].innerText;
            var price15Day = texts[8].innerText + " " + prices[8].innerText;
            var price1Day = texts[9].innerText + " " + prices[9].innerText;
            var priceFrom = texts[5].innerText + " " + prices[5].innerText;

        }else{
            console.log("problem");
            
            var price30Day = texts[6].innerText + " " + prices[6].innerText;
            var price15Day = texts[7].innerText + " " + prices[7].innerText;
            var price1Day = texts[8].innerText + " " + prices[8].innerText;
            var priceFrom = texts[4].innerText + " " + prices[4].innerText;
            var priceTrend = texts[5].innerText + " " + prices[5].innerText;
        }


        cardSearch.price = priceTrend;
        cardSearch.price30Day = price30Day;
        cardSearch.price15Day = price15Day;
        cardSearch.price1Day = price1Day;
        cardSearch.priceFrom = priceFrom;

    };
    x.send();

}