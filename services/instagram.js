const fs = require('fs');
const fetch = require('node-fetch');

class Instagram {

    followings = [];
    followers = [];

    constructor() {
        //
    }

    async sendFetchRequest(url, cookie = '') {
        let useragent = 'Mozilla/5.0 (Linux; Android 5.0.1; LG-H342 Build/LRX21Y; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/65.0.3325.109 Mobile Safari/537.36 Instagram 40.0.0.14.95 Android (21/5.0.1; 240dpi; 480x786; LGE/lge; LG-H342; c50ds; c50ds; pt_BR; 102221277)';
        let json = await fetch(url, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": cookie,
                "User-Agent": useragent
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors"
        }).then(
            res => {
                return res.json();
            }
        );
        return json;
    }

    encodeQueryUrl(url) {
        url = url.replace('{', '%7B');
        url = url.replace('}', '%7D');
        url = url.replace(':', '%3A');
        url = url.replace(',', '%2C');
        return url;
    }

    async getUserId(username) {
        let info = await this.getUserInfo(username);
        return info.id;
    }

    async getUserInfo(username) {
        let url = 'https://www.instagram.com/' + username + '/?__a=1';
        let json = await this.sendFetchRequest(url);
        let info = json.graphql.user;
        return info;
    }

    async getPost(code) {
        let url = 'https://www.instagram.com/p/' + code + '/?__a=1';
        let json = await this.sendFetchRequest(url);
        let post = json.graphql.shortcode_media;
        return post;
    }

    async getReel(code) {
        let url = 'https://www.instagram.com/reel/' + code + '/?__a=1';
        let json = await this.sendFetchRequest(url);
        let reel = json.graphql.shortcode_media;
        return reel;
    }

    async getIgtv(code) {
        let url = 'https://www.instagram.com/tv/' + code + '/?__a=1';
        let json = await this.sendFetchRequest(url);
        let tv = json.graphql.shortcode_media;
        return tv;
    }

    async getTopHashtagPost(hashtag) {
        let url = 'https://www.instagram.com/explore/tags/' + hashtag + '/?__a=1';
        let json = await this.sendFetchRequest(url);
        let post = json.graphql.hashtag.edge_hashtag_to_top_posts.edges;
        return post;
    }

    async getHashtagPost(hashtag, total, after = '') {

        let mylist = [];

        let query_hash = '9b498c08113f1e09617a1703c22b2f32';
        let first = 50;

        let queryUrl = 'https://www.instagram.com/graphql/query/?query_hash=' + query_hash + '&variables=';
        let paramUrl = '{"tag_name":"' + hashtag + '","first": ' + first + ',"after":"' + after + '"}';

        let url = queryUrl + this.encodeQueryUrl(paramUrl);

        let json = await this.sendFetchRequest(url);

        let has_next = json.data.hashtag.edge_hashtag_to_media.page_info.has_next_page;
        let end_cursor = json.data.hashtag.edge_hashtag_to_media.page_info.end_cursor;
        let media = json.data.hashtag.edge_hashtag_to_media.edges;

        if (mylist.length <= total) {
            for (var i = 0; i < media.length; i++) {
                mylist.push(media[i]);
            }
            if (has_next) {
                let newtotal = total - mylist.length;
                let next = await this.getHashtagPost(hashtag, newtotal, end_cursor);
                for (var i = 0; i < next.length; i++) {
                    mylist.push(next[i]);
                }
            }
        }
        return mylist;
    }

    async getUserPostAll(id, after = '') {

        let mylist = [];

        let query_hash = '56a7068fea504063273cc2120ffd54f3';
        let first = 36;

        let queryUrl = 'https://www.instagram.com/graphql/query/?query_hash=' + query_hash + '&variables=';
        let paramUrl = '{"id":"' + id + '","first": ' + first + ',"after":"' + after + '"}';

        let url = queryUrl + this.encodeQueryUrl(paramUrl);

        let json = await this.sendFetchRequest(url);

        let has_next = json.data.user.edge_owner_to_timeline_media.page_info.has_next_page;
        let end_cursor = json.data.user.edge_owner_to_timeline_media.page_info.end_cursor;
        let media = json.data.user.edge_owner_to_timeline_media.edges;

        for (var i = 0; i < media.length; i++) {
            mylist.push(media[i]);
        }

        if (has_next) {
            let newtotal = total - mylist.length;
            let next = await this.getUserPost(id, newtotal, end_cursor);
            for (var i = 0; i < next.length; i++) {
                mylist.push(next[i]);
            }
        }

        return mylist;
    }

    async getUserPost(id, total, after = '') {

        let mylist = [];

        let query_hash = '56a7068fea504063273cc2120ffd54f3';
        let first = 36;

        let queryUrl = 'https://www.instagram.com/graphql/query/?query_hash=' + query_hash + '&variables=';
        let paramUrl = '{"id":"' + id + '","first": ' + first + ',"after":"' + after + '"}';

        let url = queryUrl + this.encodeQueryUrl(paramUrl);

        let json = await this.sendFetchRequest(url);

        let has_next = json.data.user.edge_owner_to_timeline_media.page_info.has_next_page;
        let end_cursor = json.data.user.edge_owner_to_timeline_media.page_info.end_cursor;
        let media = json.data.user.edge_owner_to_timeline_media.edges;

        if (mylist.length <= total) {
            for (var i = 0; i < media.length; i++) {
                mylist.push(media[i]);
            }
            if (has_next) {
                let newtotal = total - mylist.length;
                let next = await this.getUserPost(id, newtotal, end_cursor);
                for (var i = 0; i < next.length; i++) {
                    mylist.push(next[i]);
                }
            }
        }
        return mylist;
    }

    async getUserFollowings(id, cookie, after = '') {
        let mylist = [];

        let query_hash = 'd04b0a864b4b54837c0d870b0e77e076';
        let first = 22;

        let queryUrl = 'https://www.instagram.com/graphql/query/?query_hash=' + query_hash + '&variables=';
        let paramUrl = '{"id":"' + id + '","fetch_mutual": false,"first": ' + first + ',"after":"' + after + '"}';

        let url = queryUrl + this.encodeQueryUrl(paramUrl);

        let json = await this.sendFetchRequest(url, cookie);

        let has_next = json.data.user.edge_follow.page_info.has_next_page;
        let end_cursor = json.data.user.edge_follow.page_info.end_cursor;
        let users = json.data.user.edge_follow.edges;

        for (var i = 0; i < users.length; i++) {
            mylist.push(users[i]);
        }
        if (has_next) {
            let next = await this.getUserFollowings(id, cookie, end_cursor);
            for (var i = 0; i < next.length; i++) {
                mylist.push(next[i]);
            }
        }
        return mylist;
    }

    async getUserFollowers(id, cookie, after = '') {
        let mylist = [];

        let query_hash = 'c76146de99bb02f6415203be841dd25a';
        let first = 22;

        let queryUrl = 'https://www.instagram.com/graphql/query/?query_hash=' + query_hash + '&variables=';
        let paramUrl = '{"id":"' + id + '","fetch_mutual": false,"first": ' + first + ',"after":"' + after + '"}';

        let url = queryUrl + this.encodeQueryUrl(paramUrl);

        let json = await this.sendFetchRequest(url, cookie);

        let has_next = json.data.user.edge_followed_by.page_info.has_next_page;
        let end_cursor = json.data.user.edge_followed_by.page_info.end_cursor;
        let users = json.data.user.edge_followed_by.edges;

        for (var i = 0; i < users.length; i++) {
            mylist.push(users[i]);
        }

        if (has_next) {
            let next = await this.getUserFollowers(id, cookie, end_cursor);
            for (var i = 0; i < next.length; i++) {
                mylist.push(next[i]);
            }
        }

        return mylist;
    }
}

module.exports = Instagram