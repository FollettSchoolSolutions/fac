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
 * html2js
 *
 * This is a port of the html2js grunt task contained in the angular-app sample application.
 *
 * For each partial file, this will create a corresponding JS file that registers the template
 * on $templateCache.  This also generates the file 'templates.js' which defines a module called
 * 'partials' that can be depended on by the application.
 *
 * Attributes:
 * prefix - If needed, this path will prefix the paths registered on $templateCache in order to match
 * the expected web path.
 *
 * Elements:
 * dirset - The set of directories to convert.  This will automatically convert all *.html files in the
 * respective directories.
 */

(function (project, attributes, elements, require) {
    /**
     * Escapes quotes, and converts new-lines to string concatenations for readability
     */
    function escapeContent (content) {
        return ('' + content).replace(/"/g, '\\"').replace(/\r?\n/g, '" +\n    "');
    };

    /**
     * If necessary, converts windows-style paths to web-paths
     */
    function normalizePath (p) {
        if ( File.separator !== '/' ) {
            p = ('' + p).replace(/\\/g, '/');
        }
        return p;
    };

    var root = project.getProperty('basedir') + '/',
        _ = require(root + 'lib/build/underscore.js')._,
        tools = require(root + 'lib/build/tools.js'),
        templatePartial = _.template('angular.module("<%= id %>", []).run(["$templateCache", function($templateCache) {\n  $templateCache.put("<%= id %>",\n    "<%= content %>");\n}]);\n'),
        templateModule = _.template("angular.module('partials', [<%= templates %>]);"),
        prefix = attributes.get('prefix') ? attributes.get('prefix') + '/' : '';
        templates = [];

    tools.forEachInDirset(elements.get('dirset').get(0), function (localeDir, baseDir) {
        var todir = baseDir + '/' + localeDir,
            fileset = tools.createFileset(todir, "**/*.html");

        tools.forEachInFileset(fileset, function (partial, partialFile) {
            var filename = normalizePath(partialFile),
                id = prefix + filename;

            templates.push("'" + id + "'");
            tools.writeStringToFile(templatePartial({id: id, content: escapeContent(partial)}), todir, filename + '.js');
        });

        tools.writeStringToFile(templateModule({templates: templates.join(', ')}), todir, 'templates.js');
    });

})(project, attributes, elements, require);
