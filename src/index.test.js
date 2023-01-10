import test from 'ava'
import React from 'react'
import ReactDOM from 'react-dom'
import { Window } from 'happy-dom'
import * as Icons from '../dist'

const happdom = new Window()
global.window = happdom.window
global.document = happdom.document

test('There are icons', t => {
  t.true(Object.values(Icons).length > 0)
})

test('Render icons witheout crashing', t => {
  const elements = Object.values(Icons).map((Icon, i) => <Icon key={i} />)
  const div = document.createElement('div')
  ReactDOM.render(elements, div)
  t.not(div.innerHTML, '')
})

test('Render icon with size', t => {
  const div = document.createElement('div')
  ReactDOM.render(<Icons.Github size={12} />, div)
  t.is(div.firstChild.getAttribute('height'), '12')
  t.is(div.firstChild.getAttribute('width'), '12')
})

test('Render icon with color', t => {
  const div = document.createElement('div')
  ReactDOM.render(<Icons.Github color="#7a16ff" />, div)
  t.is(div.firstChild.style.color, '#7a16ff')
})

test('Render icon with props', t => {
  const div = document.createElement('div')
  ReactDOM.render(<Icons.Github className="test" strokeWidth={4} />, div)
  t.true(div.firstChild.classList.contains('test'))
  t.is(div.firstChild.getAttribute('stroke-width'), '4')
})
