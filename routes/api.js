const express = require('express');
const router = express.Router();
const instagram = require('../services/instagram');

let cookie = 'ig_did=78F95127-CC4E-450B-95B7-FBBAAE378F9B; mid=XzvGHgALAAE-vzjLMc-cPzXWhDJG; shbid=14488; fbm_124024574287414=base_domain=.instagram.com; csrftoken=FZVqK7RI5xs5UyKDRYXP6Dl4wDJ4urYU; ds_user_id=5698133721; sessionid=5698133721%3ANp16aQoSU8IUGf%3A8; shbts=1602933725.958077; ig_direct_region_hint=ASH; rur=FRC; urlgen=\"{\\\"2405:205:c821:8b42:8980:d2bd:e4d7:c8ec\\\": 55836}:1kUYn0:SpLp8IPCVrX0_XwvOOJwQGdgdl8\"';

let ig = new instagram();

router.get('/ig/info/:username', async function (req, res) {

    let result = await ig.getUserInfo(req.params.username);

    let re = {
        code: 200,
        status: "success",
        request: "info",
        result: result
    }

    res.send(re);
});

router.get('/ig/media/post/:id', async function (req, res) {
    let result = await ig.getPost(req.params.id);

    let re = {
        code: 200,
        status: "success",
        request: "post",
        result: result
    }

    res.send(re);
});

router.get('/ig/media/reel/:id', async function (req, res) {
    let result = await ig.getReel(req.params.id);

    let re = {
        code: 200,
        status: "success",
        request: "reel",
        result: result
    }

    res.send(re);
});

router.get('/ig/media/igtv/:id', async function (req, res) {

    let result = await ig.getIgtv(req.params.id);

    let re = {
        code: 200,
        status: "success",
        request: "igtv",
        result: result
    }

    res.send(re);
});

router.get('/ig/media/tophastag/:hastag', async function (req, res) {
    let result = await ig.getTopHashtagPost(req.params.hastag);

    let re = {
        code: 200,
        status: "success",
        request: "tophastag",
        result: result
    }

    res.send(re);
});

router.get('/ig/media/hastag/:hastag', async function (req, res) {
    let result = await ig.getHashtagPost(req.params.hastag, 50);

    let re = {
        code: 200,
        status: "success",
        request: "hastag",
        result: result
    }

    res.send(re);
});

router.get('/ig/allpost/:username', async function (req, res) {
    let id = await ig.getUserId(req.params.username);
    let result = await ig.getUserPostAll(id);

    let re = {
        code: 200,
        status: "success",
        request: "allpost",
        result: result
    }

    res.send(re);
});

router.get('/ig/followings/:username', async function (req, res) {
    let id = await ig.getUserId(req.params.username);
    let result = await ig.getUserFollowings(id, cookie);

    let re = {
        code: 200,
        status: "success",
        request: "followings",
        result: result
    }

    res.send(re);

});

router.get('/ig/followers/:username', async function (req, res) {
    let id = await ig.getUserId(req.params.username);
    let result = await ig.getUserFollowers(id, cookie);


    let re = {
        code: 200,
        status: "success",
        request: "followers",
        result: result
    }

    res.send(re);
});

module.exports = router;