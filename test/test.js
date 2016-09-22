'use strict';

const assert = require('assert');
const ActiveCollab = require('../index');
const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

if (!process.env.email || !process.env.password) {
    throw 'Expected an email and password in process.env';
}

const client = new ActiveCollab.Client('ActiveCollab.js', 'Gerard');

describe('Client', function () {
    describe('#login()', function () {
        it('should login', () => client.login(process.env.email, process.env.password));
    });
});

describe('Account', function () {
    let account;

    before(() => {
        if (client.accounts.empty()) {
            throw 'No accounts are loaded.'
        }

        account = client.accounts.first();
    });

    describe('#issueToken()', function () {
        it('should fetch the token', () => account.issueToken());
    });

    describe('#addProject()', function () {
        it('should add a new project', () => account.addProject());
    });

    describe('#getProjects()', function () {
        it('should get the projects', () => account.getProjects());
    });

    describe('#addProject()', function () {
        it('should fail because the name is missing', () => expect(account.addProject({})).to.be.rejected);
        it('should add a new Test project', () => expect(account.addProject({name: 'Test'})).to.be.fulfilled);
    });
});

describe('Project', function () {
    let account;

    before(() => {
        if (client.accounts.empty()) {
            throw 'No accounts are loaded.'
        }

        account = client.accounts.first();
    });

    describe('#remove()', function () {
        it('should remove the Test project(s)', () => {
            return expect(account.getProjects()
                .then((projects) => projects
                    .filter((project) => project.name === 'Test')
                    .promise((project) => project.remove())
                )
            ).to.be.fulfilled
        });
    });
});