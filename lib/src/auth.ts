import _ from 'lodash';
import { post, validateResponseCode } from './common';
import { logger } from './logger';

//////////////////////////////////////////////////////////////////////////////

export const login = async (baseUrl: string, username: string, password: string): Promise<string> => {
    const data: object = {
        password,
        username,
    };

    const response = await post(baseUrl, null, '/auth/login', data);
    validateResponseCode(response);

    const success = _.get(response, 'content.success');
    if (success !== true) { throw new Error(`Failed to login: ${JSON.stringify(response)}`); }

    const token = _.get(response, 'content.token');
    return token;
}

module.exports = {
    login
};

/*
const http = require('http');
const https = require('https');
const { post, validateResponseCode } = require('../../../../js/apps/capture_test/sdk/common');
const _ = require('lodash');

//////////////////////////////////////////////////////////////////////////////

async function login(baseUrl, username, password) {
    const data = {
        username,
        password,
    };

    const response = await post(baseUrl, null, '/auth/login', data);
    validateResponseCode(response);

    const success = _.get(response, 'content.success');
    if (success !== true) throw new Error(`Failed to login: ${JSON.stringify(response)}`);

    const token = _.get(response, 'content.token');
    return token;
}

module.exports = {
    login
};*/