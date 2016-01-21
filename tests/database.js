"use strict";

import {createList, retrieveLists, retrieveList, updateList, archiveList} from '../db/lists.js';
import {retrieveTasks, archiveTask, createTask, updateTask} from '../db/tasks';
import {expect} from 'chai';

describe('Database test suite', function() {

    describe('List table tests', function () {

        it('Creates a list', function(done) {
            createList('test', function(error, result) {
                expect(error).to.not.be.a('undefined');
                expect(result).to.not.be.empty;
                done();
            });
        });

        it('Retrieves all lists', function (done) {

            retrieveLists(function (error, results) {
                expect(error).to.not.be.a('undefined');
                expect(results).to.not.be.empty;
                done();
            });
        });

        it('Retrieves single list', function (done) {

            retrieveList(1, function (error, list) {
                expect(list).to.not.be.a('undefined');
                done();
            });
        });

        it('Updates single list', function (done) {
            updateList(2, 'Updated value', function (error, list) {
                expect(list[0].title).to.equal('Updated value');
                done();
            });
        });

        it('Archives single list', function (done) {
            archiveList(2, function (error, list) {
                expect(list[0].archived_at).to.not.equal('null');
                done();
            });
        });
    });

    describe('Tasks table tests', function () {

        it('Retrieve all tasks in a list', function (done) {
            retrieveTasks(1, function (error, tasks) {
                expect(tasks).to.not.be.empty;
                done();
            });
        });

        it('Create task', function (done) {
            createTask(1, 'Created task', function (error, task) {
                expect(task).to.not.be.empty;
                done();
            });
        });

        it('Update task', function (done) {
            updateTask(4, 'testing', function (error, task) {
                expect(task).to.not.be.empty;
                done();
            });
        });

        it('Archive task', function (done) {
            archiveTask(4, function (error, task) {
                expect(task).to.not.be.empty;
                done();
            });
        });
    });
});

