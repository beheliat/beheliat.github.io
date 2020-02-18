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
                app5.mkmURL = result.purchase_uris.cardmarket;
                app5.imgSRC = result.image_uris.border_crop;
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
        app5.price = 'Price trend : ' + result.prices.eur + '\u20AC';
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