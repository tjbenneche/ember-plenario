import DS from "ember-data";
import Ember from "ember";

export default DS.RESTAdapter.extend({
  host: 'http://plenar.io',
  namespace: 'api/v1',
  baseURL: Ember.computed('host', 'namespace', function() {
    return `${this.get('host')}/${this.get('namespace')}`;
  }),

  /**
   *
   * Helper for overriding Adapter methods.
   * Given an ID and a resource path, return the Promise
   * that will resolve to the requested model.
   *
   * @param path Path of the resource after the API namespace, including
   * @param id If specified, save serialized object to the store with this ID.
   * @returns {Ember.RSVP.Promise}
     */
  promiseFromPath(path, id) {
    const url = this.baseURL + path;
    // Boilerplate Promise construction taken from Ember docs example
    // of overriding RESTAdapter::findRecord
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.getJSON(url).then(function(data) {
        if (id !== undefined) {
          // Assign the id generated from the application
          // so that we can fetch it from the store.
          // A useful hack for when the application wants to define
          // ids for queries.
          data.id = id;
        }
        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });});
  }

});
