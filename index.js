const _ = require('lodash')
const colors = require('colors')
const debug = require('debug')('db')

let db = null

const checkTable = function ({name, model}) {
  let properties = model.properties
  let required = model.required || []
  let tableName = _.snakeCase(name)

  required.forEach(prop => properties[prop].required = true)
  return db.schema.hasTable(tableName).then(
    isExist => isExist ? checkColumns(tableName, properties) : createTable(tableName, properties)
  )
}

const checkColumns = function (name, props) {
  debug('table %s has existed, checking columns...', name)

  let cols = _.keys(props)

  let checkResult = _.map(cols, (col) => db.schema.hasColumn(name, col))

  let NotExistColumnsCreator = (checkResult) => {
    return checkResult.reduce((notExist, isExist, index) => {
      !isExist && notExist.push(
        db.schema.table(name, table => createColumn(table)(props[cols[index]], cols[index]))
      )
      return notExist
    }, [])
  }

  return Promise.all(checkResult).then(NotExistColumnsCreator).then(res => Promise.all(res))
}

const createColumn = function (table) {
  return (prop, key) => {
    let column = table[prop.type](key)
    _.has(prop, 'description') && column.comment(prop.description)
    _.has(prop, 'default') && column.defaultTo(prop.default)
    _.has(prop, 'required') && column.notNullable()
    debug('     create column: %s finish', key)
  }
}

const createTable = function (name, props) {
  debug('  table %s not exist', name)
  debug('    create table: %s', name)
  return db.schema.createTableIfNotExists(name, (table) => {
    table.increments()
    let cols = _.omit(props, 'id')
    _.forEach(cols, createColumn(table))
  }).catch(err => console.log(err))
}

module.exports = function ({ definitions }, client) {
  let isLoaded = false

  if (!client) {
    throw new Error('The argument db miss.')
  }
  db = client
  definitions = Object.keys(definitions).map((name) => {
    if (definitions[name] && !definitions[name]['x-additional'])
      return checkTable({ name, model: definitions[name] })
    else
      return Promise.resolve(true)
  })

  Promise.all(definitions)
    .then(() => { isLoaded = true })
    .catch(err => { throw err })
    .then(() => {
      console.log(colors.blue('Database check finished!!!'))
    })
}
