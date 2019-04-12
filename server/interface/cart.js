import Router from 'koa-router';
import axios from './utils/axios'
import Cart from '../dbs/models/cart'
import md5 from 'crypto-js/md5'

let router = new Router({prefix: '/cart'})

router.post('/create', async ctx => {
  //判断是否登陆
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: 'please login'
    }
  } else {
    //创建时间对象
    let time = Date()
    //用md5转字符串方式生成购物车单号
    let cartNo = md5(Math.random() * 1000 + time).toString()
    //从前端获取id和detail
    let {
      params: {
        id,
        detail
      }
    } = ctx.request.body
    //创建Cart mogoose对象
    let cart = new Cart({id, cartNo, time, user: ctx.session.passport.user, detail})
    //保存购物车
    let result = await cart.save()
    if (result) {
      ctx.body = {
        code: 0,
        msg: '',
        id: cartNo
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'fail'
      }
    }
  }
})

router.post('/getCart', async ctx => {
  //获取购物车信息
  let {id} = ctx.request.body
  try {
    let result = await Cart.findOne({cartNo: id})
    ctx.body = {
      code: 0,
      data: result
        ? result.detail[0]
        : {}
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      data: {}
    }
  }
})

export default router
