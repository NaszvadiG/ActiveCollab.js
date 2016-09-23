'use strict';

class Base {
    constructor(account, data) {
        if (account && data) {
            this.account = account;
            this.set(data);
        } else {
            this.set(account);
        }
    }

    /**
     * Get the path of the class.
     *
     * @returns {string}
     */
    getPath() {
        return this.path;
    }

    set(data) {
        if (data) {
            for (let key of Object.keys(data)) {
                this[key] = data[key];
            }
        }
    }

    save() {
        if (!this.account) {
            return Promise.reject('The account is not set.');
        }

        if (this.id) {
            return this.account.put(this.getPath() + '/' + this.id, this);
        } else {
            return this.account.post(this.getPath(), this);
        }
    }

    remove() {
        if (!this.account) {
            return Promise.reject('The account is not set.');
        }

        if (this.id) {
            return this.account.remove(this.getPath() + '/' + this.id);
        } else {
            return Promise.resolve();
        }
    }

    /**
     * Create a property.
     *
     * @param url
     * @returns {function(): Promise|{read: (function(): Promise), create: (function(*=): Promise), update: (function(*=): Promise), remove: (function(*): Promise)}}
     * @protected
     */
    _createProp(url) {
        let prop = () => this.account.get(url())['tasks'];
        prop.read = () => this.account.get(url());
        prop.create = (object) => this.account.post(url(), object);
        prop.update = (object) => this.account.put(url(), object);
        prop.remove = (object) => this.account.remove(url());
        return prop;
    }
}

module.exports = Base;