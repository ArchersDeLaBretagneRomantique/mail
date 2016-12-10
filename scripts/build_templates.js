#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { compile } = require('handlebars')
const { mjml2html } = require('mjml')

const indexFile = 'index.mjml'
const templatePath = path.join(__dirname, '../templates')
const htmlPath = path.join(__dirname, '../html')

const colors = {
  green: {
    start: '\u001b[32m',
    end: '\u001b[39m',
  },
  red: {
    start: '\u001b[31m',
    end: '\u001b[39m',
  },
}
const logError = err => console.log(`${colors.red.start}${err}${colors.red.end}`)
const logSuccess = msg => console.log(`${colors.green.start}${msg}${colors.green.end}`)

function createHtmlDir() {
  return new Promise((resolve, reject) => {
    fs.mkdir(htmlPath, (err) => {
      if (err && err.code !== 'EEXIST') reject(err)
      else resolve()
    })
  })
}

function readTemplateFile() {
  return new Promise((resolve) => {
    const templatePathFile = path.join(templatePath, indexFile)
    fs.readFile(templatePathFile, (err, file) => {
      if (err) throw new Error(err)
      resolve(file.toString('utf-8'))
    })
  })
}

function getAllEmailTypes() {
  return new Promise((resolve, reject) => {
    fs.readdir(templatePath, (err, files) => {
      if (err) reject(err)
      else resolve(files.filter(f => f !== indexFile).map(f => /(.+)\.mjml/.exec(f)[1]))
    })
  })
}

function compileEmailTemplates(template, emailTypes) {
  return Promise.all(
    emailTypes.map((type) => {
      const { html } = mjml2html(compile(template)({ type }))
      return new Promise((resolve, reject) => {
        fs.writeFile(path.join(htmlPath, `${type}.html`), html, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    })
  )
}

// Generate all html email templates from mjml
Promise.all([
  readTemplateFile(),
  getAllEmailTypes(),
  createHtmlDir(),
])
  .then(values => compileEmailTemplates(...values))
  .then(() => logSuccess('Success'))
  .catch(logError)
