importClass(java.io.File);
importClass(java.io.FileReader);
importClass(java.io.FileWriter);
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
 * tools
 *
 * This is a library of tools that can be included by other scripts.
 */
(function(project, exports, require) {
    var root = project.getProperty('basedir') + '/',
        _ = require(root + 'lib/build/underscore.js')._;

    /**
     * Read the contents of a file into a string and return it
     */
    exports.readFileIntoString = function (dir, file) {
        var reader, contents;

        reader = new FileReader(new File(dir, file));
        try {
            contents = FileUtils.readFully(reader);
        } finally {
            reader.close();
        }

        return contents;
    };

    /**
     * Writes a string to a file (Overwrites the file if it exists)
     */
    exports.writeStringToFile = function (contents, dir, file) {
        var f = new File(dir, file), writer;

        f.getParentFile().mkdirs();
        writer = new FileWriter(f, false);

        try {
            writer.write(contents);
        } finally {
            writer.close();
        }
    };

    /**
     * Reads each file in a fileset and calls the function f with args (contents, filePathRelativeToDir, dir)
     */
    exports.forEachInFileset = function (fileset, f) {
        var ds = fileset.getDirectoryScanner(project),
            dir = fileset.getDir(project),
            srcFiles = ds.getIncludedFiles();

        _.each(srcFiles, function (srcFile) {
            var contents = exports.readFileIntoString(dir, srcFile) || '  ';

            f(contents, srcFile, dir);
        });
    };

    /**
     * For each directory in dirset, calls function f with args (dirPathRelativeToBaseDir, baseDir)
     */
    exports.forEachInDirset = function(dirset, f) {
        var ds = dirset.getDirectoryScanner(project),
            dirs= ds.getIncludedDirectories(),
            baseDir = dirset.getDir(project);

        _.each(dirs, function(dir) {
            f(dir, baseDir);
        });
    };

    /**
     * Creates a new fileset object
     */
    exports.createFileset = function(dir, includes, excludes) {
        var fileset = project.createDataType("fileset");
        fileset.setDir(new File(dir));
        fileset.setIncludes(includes);
        fileset.setExcludes(excludes);

        return fileset;
    };

    /**
     * Takes a JSON string and returns a JavaScript object
     */
    exports.stringToJson = function (str) {
        return eval("(" + str + ")");
    };

    /**
     * Converts a Java List object to a JS array
     */
    exports.getJavaListAsArray = function (list) {
        var _i, _len, result = [];

        for (_i = 0, _len = list.size(); _i < _len; _i++) {
            result.push(list.get(_i));
        }

        return result;
    };

})(project, exports, require);