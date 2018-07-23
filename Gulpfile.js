const gulp = require('gulp');
const jsdoc2md = require('jsdoc-to-markdown');
const xo = require('gulp-xo');

gulp.task('lint', () =>
    gulp.src('index.js')
        .pipe(xo())
        .pipe(xo.format())
        .pipe(xo.failAfterError())
);

gulp.task('docs', () => {
    const fs = require('fs');
    let output = fs.readFileSync('readme/README.header.md');
    output += jsdoc2md.renderSync({files: './movehub.js'});
    output += fs.readFileSync('readme/README.footer.md');
    fs.writeFileSync('README.md', output);
});
