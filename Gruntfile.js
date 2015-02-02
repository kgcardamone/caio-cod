module.exports = function(grunt) {
    'use strict';

    // Inicia configuração do Grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // O objeto path abaixo tem duas propriedades
        // para definir os diretórios de desenvolvimento e produção dos assets/
        // Para acessar o objeto no grunt, usamos a sintaxe <%= path.dev %> que será application/ ou <%= path.dist %>
        // que será public/
        path: {
            dev: 'application/',
            dist: 'public/'
        },

        // Essa tarefa cssmin, pega todos os arquivos .css em desenvolvimento,
        // os minifica e gera o novo arquivo .min.css na pasta de produção.

        // Para rodar a tarefa e o Grunt realizá-la automatizadamente, basta rodar no terminal o
        // comando grunt cssmin e pronto!

        // Para saber mais sobre esse plugin do grunt, https://github.com/gruntjs/grunt-contrib-cssmin
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= path.dev %>/assets/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= path.dist %>/assets/css/',
                    ext: '.min.css'
                }]
            }
        },

        // A tarefa imagemin pega todas as imagens da pasta de desenvolvimento e as minifica e otimiza,
        // gerando novos arquivos na produção.
        // Para rodar a tarefa, basta rodar grunt imagemin no terminal
        // Para saber mais sobre o plugin https://github.com/gruntjs/grunt-contrib-imagemin
        imagemin: {
            options: {
                optimizationLevel: 7
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= path.dev %>/assets/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= path.dist %>/assets/img/'
                }]
            }
        },

        // A tarefa concat, pega todos os arquivos javascript que você está usando no projeto,
        // e os concatena em somente um na produção, o que contribui para performance.
        // Para rodar a tarefa basta usar o comando grunt concat no terminal.
        concat: {
            options: {
                separator: "\n"
            },
            dist: {
                src: [
                    '<%= path.dev %>/assets/js/jquery.js',
                    '<%= path.dev %>/assets/js/respond.js',
                    '<%= path.dev %>/assets/js/bootstrap.js',
                    '<%= path.dev %>/assets/js/*.js',
                    '<%= path.dev %>/assets/js/main.js'
                ],
                dest: '<%= path.dist %>/assets/js/build.js'
            }
        },

        // A tarefa JSHint serve para otimizar a utilização da ferramenta de testes
        // de javascript JsHint, assim teremos um código com mais qualidade.
        // http://jshint.com/
        // O plugin do grunt está em https://github.com/gruntjs/grunt-contrib-jshint
        jshint: {
            all: ['Gruntfile.js', '<%= path.dev %>/assets/js/main.js']
        },


        // A tarefa Uglify minifica e ofusca o arquivo concatenado que geramos anteriormente,
        // deixando para utilizarmos em produção.
        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            all: {
                files: [{
                    expand: true,
                    cwd: '<%= path.dist %>/assets/js/',
                    src: ['*.js', '!*.min.js'],
                    dest: '<%= path.dist %>/assets/js/',
                    ext: '.min.js'
                }]
            }
        },

        // O plugin Watch do Grunt é a parte mais legal
        // Ele permite que você rode todas as tarefas que configuramos anteriormente
        // e as realize sempre que salvamos um arquivo em desenvolvimento
        // Basicamente ele fica assistindo os arquivos de desenvolvimento.
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            css: {
                files: '<%= path.dev %>/assets/css/*.css',
                tasks: 'cssmin'
            },
            imagemin: {
                files: ['<%= path.dev %>/assets/images/**/*.png', '<%= path.dev %>/assets/images/**/*.jpg', '<%= path.dev %>/assets/images/**/*.gif'],
                tasks: 'imagemin'
            },
            javascript: {
                files: ['<%= path.dev %>/assets/javascript/**/*.js', '<%= path.dev %>/assets/javascript/*.js'],
                tasks: ['concat', 'jshint']
            }
        }
    });
    // Plugin para carregar todas as tarefas do package.json automaticamente, sem necessidade
    // de carregá-las manualmente.
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['imagemin', 'cssmin', 'concat', 'uglify']);
};