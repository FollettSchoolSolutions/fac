importClass(java.io.File);
importClass(java.io.FileReader);
importClass(org.apache.tools.ant.util.FileUtils);
importClass(com.google.javascript.jscomp.Compiler);
importClass(com.google.javascript.jscomp.CompilerOptions);
importClass(com.google.javascript.jscomp.JSSourceFile);
importClass(com.google.javascript.jscomp.CompilationLevel);

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
 * minify-fileset
 *
 * This is basically a workaround to the problem with com.google.javascript.jscomp.ant.CompileTask
 * not supporting filesets.  Currently, this supports a single fileset, but can be fixed in the
 * future to support any number of filesets if needed.
 *
 * This is currently hard-coded to SIMPLE_OPTIMIZATIONS and does not support externs.
 *
 * Attributes:
 * none
 *
 * Elements:
 * fileset - The files to minify.  The input files will be overwritten with their minified versions.
 */
(function (project, attributes, elements, require) {
    var root = project.getProperty('basedir') + '/',
        tools = require(root + 'lib/build/tools.js');

    tools.forEachInFileset(elements.get('fileset').get(0), function (contents, path, dir) {
        var compiler = new Compiler(),
            options = new CompilerOptions(),
            sourceFile = JSSourceFile.fromFile(new File(dir, path));

        CompilationLevel.SIMPLE_OPTIMIZATIONS.setOptionsForCompilationLevel(options);

        compiler.compile(JSSourceFile.fromCode('externs.js', ''), sourceFile, options);

        tools.writeStringToFile(compiler.toSource(), dir, path);
    });

})(project, attributes, elements, require);