importClass(java.io.File);
importClass(java.io.FileReader);
importClass(org.apache.tools.ant.util.FileUtils);

/**
 * Rhino is just getting support for common.js modules (1.7R3),
 * but until this gets released on the JDK, this is necessary.
 *
 * Reads the specified file and eval it, returning anything it specified on the
 * exports.
 *
 * file - String path of the library to import.
 */
function require(file) {
    var exports = {}, reader = new FileReader(file);
    try {
        eval('' + FileUtils.readFully(reader));
    } finally {
        reader.close();
    }
    return exports;
}

/**
 * concat-partials-to-js
 *
 * Given this directory structure of partial html files that have ben converted to js
 * > temp
 *   lib.js
 *   > partials
 *     > home.html.js
 *     > etc.
 * This task concatenates all the .js files in a directory
 *
 * Attributes:
 * todir - The base directory of the output of this task (e.g. temp in the above example)
 * tofile - The name of the output file to append all the partials.
 *
 * Elements:
 * dirset - A dirset containing all js files to concatenate.  In the above example, this would
 * be a set containing temp/partials
 */
(function (project, attributes, elements, require) {
    var root = project.getProperty('basedir') + '/',
        tools = require(root + 'lib/build/tools.js'),
        toDir = root + attributes.get('todir');

    tools.forEachInDirset(elements.get('dirset').get(0), function (partialDir, baseDir) {
        var jsDir = toDir,
            partialsDir = baseDir + '/' + partialDir,
            concatTask = project.createTask("concat");

        concatTask.setAppend(true);
        concatTask.setFixLastLine(true);
        concatTask.setDestfile(new File(jsDir, attributes.get('tofile')));
        concatTask.addFileset(tools.createFileset(partialsDir, '**/*.js'));
        concatTask.perform();
    });

})(project, attributes, elements, require);