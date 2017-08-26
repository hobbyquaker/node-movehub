const gulp = require('gulp');
const jsdoc2md = require('jsdoc-to-markdown');

gulp.task('docs', function () {
    const fs = require('fs');
    let output = fs.readFileSync('readme/README.header.md');
    output += jsdoc2md.renderSync({files: './index.js'});
    output += fs.readFileSync('readme/README.footer.md');
    fs.writeFileSync('README.md', output)
});
