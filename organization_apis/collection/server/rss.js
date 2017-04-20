// importing RssFeed library
import { RssFeed } from 'meteor/raix:rssfeed';
// importing organizations schema
import Organizations from '/organizations/collection';
// importing api schema
import Apis from '/apis/collection';
// importing apis belong to organization schema
import OrganizationApis from '../';

// calling Rss feed publication
// first argument (apis) will build the url for the feed i.e domain-name/rss/apis
RssFeed.publish('apis', function () {
  // initialization of variable feed
  const feed = this;
  // Look at each entry of OrganizationApis shcema
  OrganizationApis.find().forEach((organizationApi) => {
    // make a filter key for Apis schema
    const apiOrganizationId = organizationApi.apiId;
    // make a filter key for Organization schema
    const OrganizationId = organizationApi.organizationId;
    // create object from Apis schema according to apiorganizationId
    const api = Apis.findOne({ _id: apiOrganizationId });
    // create object from Organizations schema according to OrganizationId
    const organization = Organizations.findOne({ _id: OrganizationId });
    // append an item to our feed using the .addItem() method
    feed.addItem({
      title: api.name,
      description: `${api.description}is belongs to ${organization.name}`,
      link: `/apis/${api.slug}`,
      pubDate: api.created_at,
    });
  });
});
