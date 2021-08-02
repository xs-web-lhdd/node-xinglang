/**
 * @description jest server
 * @author 凉风有信、
 */

const request = require('supertest')
const server = require('../src/app').callback()

module.exports = request(server)