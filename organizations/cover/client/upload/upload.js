/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

// Collection imports
import OrganizationCover from '/organizations/cover/collection/collection';
import Organizations from '../../../collection';

Template.uploadOrganizationCover.onCreated(function () {
  const instance = this;

  // Subscribe to Organization cover
  instance.subscribe('organizationCover');
});

Template.uploadOrganizationCover.helpers({
  uploadedOrganizationLogoFile () {
    const organizationCoverFileId = Organizations.findOne().organizationCoverFileId;

    let organizationCoverFile;

    if (organizationCoverFileId) {
      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(organizationCoverFileId);

      // Get Organization logo file Object
      organizationCoverFile = OrganizationCover.findOne(objectId);
    }
    return organizationCoverFile;
  },
});

Template.uploadOrganizationCover.events({
  'click .delete-organizationCover': function (event, templateInstance) {
    // Show confirmation dialog to user
    // eslint-disable-next-line no-alert
    const confirmation = confirm(TAPi18n.__('uploadOrganizationLogo_confirm_delete'));

    const organization = templateInstance.data.organization;

    // Check if user clicked "OK"
    if (confirmation === true) {
      // Get organization cover ID from organization
      const organizationCoverFileId = organization.organizationCoverFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(organizationCoverFileId);

      // Remove Organization cover object
      OrganizationCover.remove(objectId);

      // Remove Organization cover file id field
      Organizations.update(organization._id, {
        $unset: { organizationCoverFileId: '' },
      });

      // Get deletion success message
      const message = 'Successfully removed.';

      sAlert.success(message);
    }
  },
});
