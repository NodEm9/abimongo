/**
 * @package Abimongo Core Library
 * This library provides core functionalities for Abimongo, including database operations, configuration, and more.
 * It is designed to be used both in Node.js and browser environments.
 * @module Abimongo - (Core)
 * @version 1.0.0
 */
export * from './src/index';
const initAbimongo = setTimeout(() => {
	console.log('Abimongo Core (Version 1.0.0) initialising...');
}, 100);
clearTimeout(initAbimongo);

console.log('Abimongo Core (Version: 1.0.0) initialised.');