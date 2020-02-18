var app = new Vue({
    el: '#app',
    data: {
        message: 'MTG Card Name'
    }
});

var app5 = new Vue({
    el: '#app-5',
    data: {
        message: '',
        price: '',
        mkmURL: '',
        imgSRC: ''
    },
    methods: {
        getPrice: function () {
            var q = this.message;
            getCardPrice(q);

        },
        getAllCard: function () {
            var q = this.message;
            getCardList(q);
        }
    }
});


function getCardPrice(q) {
    var api = 'https://api.scryfall.com/cards/named?fuzzy=' + q;
    var x = new XMLHttpRequest();
    x.open('GET', api);
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.onload = function () {
        var result = JSON.parse(x.response);
        console.log(result);
        
        if (result.status === 400) {
            ons.notification.alert('Error retriving card info');
        } else {

            if (result.prices.eur === null) {
                app5.price = 'Price trend : ' + result.prices.usd + '$';
            } else {
                app5.price = 'Price trend : ' + result.prices.eur + '\u20AC';
            }
            app5.mkmURL = result.purchase_uris.cardmarket;
            app5.imgSRC = result.image_uris.border_crop;
        }



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