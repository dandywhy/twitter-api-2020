const { Followship, User } = require('../models')
const helpers = require('../_helpers')
const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const { id } = helpers.getUser(req)
      const userFollowing = await User.findByPk(req.body.id)
      const userFollower = await User.findByPk(id)
      if (!userFollowing) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '您要追蹤的使用者不存在'
          })
      }
      if (id == req.body.id) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '不可追蹤自己'
          })
      }
      const followingUser = await Followship.findOne({
        where: {
          followingId: req.body.id,
          followerId: id
        }
      })
      if (followingUser) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '您已追蹤過此使用者'
          })
      }
      const followship = await Followship.create({
        followerId: id,
        followingId: req.body.id
      })
      if (followship) {
        userFollowing.increment('followerCount')
        userFollower.increment('followingCount')
        return res.status(200).json({
        status: 'success',
        message: '成功追蹤此使用者!'
      })
    }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const { id } = helpers.getUser(req)
      const userFollowing = await User.findByPk(req.params.id)
      const userFollower = await User.findByPk(id)
      if (!userFollowing) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '您要取消追蹤的使用者不存在'
          })
      }
      if (id == req.params.id) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '不可取消追蹤自己'
          })
      }
      const followingUser = await Followship.findOne({
        where: {
          followingId: req.params.id,
          followerId: id
        }
      })
      if (!followingUser) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '您本來就無追蹤過此使用者'
          })
      } else {
        await followingUser.destroy()
      }
      await userFollowing.decrement('followerCount')
      await userFollower.decrement('followingCount')
      return res.status(200).json({
        status: 'success',
        message: '成功取消追蹤此使用者!'
      })
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  }
}
module.exports = followshipController
