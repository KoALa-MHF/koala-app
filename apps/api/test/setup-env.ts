// seeding clears the media folder, so the e2e tests use their own folder to keep the files of the local development
process.env.uploadFolderPath = './uploads-e2e';
