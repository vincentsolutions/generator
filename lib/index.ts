import * as Inquirer from 'inquirer';
import * as Fs from 'fs';
import * as ChangeCase from 'change-case';
import * as FindFolder from 'node-find-folder';
import * as Minimist from 'minimist';
import apiTemplate from './templates/ApiTemplate';
import modelTemplate from './templates/ModelTemplate';
import storeTemplate from './templates/StoreTemplate';
import containerTemplate, { styles as containerTemplateStyles } from './templates/AreaTemplate/ContainerTemplate';
import {Dictionary, TemplateChoice} from "../index";
import {hasOwnProperty} from "tslint/lib/utils";

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

const CURR_DIR = process.cwd();
const ENCODING = 'utf8';

const args = Minimist(process.argv.slice(2));

export function startPrompt() {
    const CHOICES: Inquirer.ChoiceType[] = [
        {
            name: 'Api Class',
            value: 'api'
        },
        {
            name: 'Store Class',
            value: 'store'
        },
        {
            name: 'Model Class',
            value: 'model'
        },
        {
            name: 'Full Entity (Api, Store & Model Classes)',
            value: 'entity'
        },
        {
            name: 'Area (View Container, Folder Structure)',
            value: 'area'
        }
    ];

    const QUESTIONS: Inquirer.Question[] = [
        {
            name: 'templateChoice',
            type: 'list',
            message: 'What file/template would you like to generate?',
            choices: CHOICES
        },
        {
            name: 'entityName',
            type: 'input',
            message: 'Entity name: ',
            validate: validateClassName
        }
    ];

    Inquirer.prompt(QUESTIONS)
        .then(handleAnswers)
        .catch(console.log);
}

export function validateClassName(input: string) {
    if (/^([A-Za-z])+$/.test(input) && input.length > 0) return true;
    else return 'Project name may only include letters and may not be empty.'
}

export function handleAnswers(answers: Inquirer.Answers, templateChoiceOverride?: TemplateChoice) {
    const templateChoice: TemplateChoice = templateChoiceOverride || answers['templateChoice'];
    const pluralTemplateChoice = `${templateChoice}s`;
    const entityName: string = answers['entityName'];
    
    let filePath = "";
    let fileName = ChangeCase.pascal(entityName);
    let fileExtension = ".ts";
    let fileContents = "";
    let properties: Dictionary<string, string> = {
        ENTITY_NAME_PASCAL: ChangeCase.pascal(entityName),
        ENTITY_NAME_CAMEL: ChangeCase.camel(entityName)
    };
    
    switch (templateChoice) {
        case "api":
            fileContents = apiTemplate;
            fileName += "sApi";
            break;
        case "model":
            fileContents = modelTemplate;
            break;
        case "store":
            fileContents = storeTemplate;
            fileName += "Store";
            break;
        case "entity":
            handleAnswers(answers, "api");
            handleAnswers(answers, "store");
            handleAnswers(answers, "model");
            return;
        case "area":
            createArea(entityName);
            return;
    }

    // if (hasOwnProperty(args, 'file-content')) {
    //     fileContents = args['file-content'];
    // }

    const singularFolder = new FindFolder(templateChoice);
    const pluralFolder = new FindFolder(pluralTemplateChoice);

    if (singularFolder && singularFolder.length > 0) {
        filePath = singularFolder[0];
    } else if (pluralFolder && pluralFolder.length > 0) {
        filePath = pluralFolder[0];
    } else {
        throw new Error(`Couldn't find the ${templateChoice}(s) directory to create the new area.`)
    }

    filePath += `/${fileName}${fileExtension}`;

    createFileFromTemplate(fileContents, filePath, properties);
}

export function processFileContents(fileContents: string, propertiesToReplace: Dictionary<string, string>) {
    let processedFileContents = fileContents;
    
    Object.keys(propertiesToReplace).forEach(key => {
        processedFileContents = replaceAll(processedFileContents, `{{${key}}}`, propertiesToReplace[key]);
    });
    
    return processedFileContents;
}

export function createFileFromTemplate(fileContents: string, filePath: string, properties: Dictionary<string, string>) {
    let processedFileContents = fileContents ? processFileContents(fileContents, properties) : "";

    Fs.writeFileSync(filePath, processedFileContents, ENCODING);
    
    console.log(`SUCCESS: Created ${filePath}.`);
}

export function createArea(className: string) {
    const viewFolder = new FindFolder('view');
    const viewsFolder = new FindFolder('views');

    let newFolderPath;

    if (viewFolder && viewFolder.length > 0) {
        newFolderPath = viewFolder[0];
    } else if (viewsFolder && viewsFolder.length > 0) {
        newFolderPath = viewsFolder[0];
    } else {
        throw new Error("Couldn't find the views directory to create the new area.")
    }

    let areaPath = `${newFolderPath}/${ChangeCase.camel(className)}`;
    let filePath = `${areaPath}/${ChangeCase.pascal(className)}Container`;

    Fs.mkdirSync(areaPath);
    Fs.mkdirSync(`${areaPath}/components`);

    let properties: Dictionary<string, string> = {
        ENTITY_NAME_PASCAL: ChangeCase.pascal(className),
        ENTITY_NAME_CAMEL: ChangeCase.camel(className)
    };

    createFileFromTemplate(containerTemplate, `${filePath}.tsx`, properties);
    createFileFromTemplate(containerTemplateStyles, `${filePath}.less`, properties);

    console.log(`SUCCESS: Created area ${className}.`);
}

export function replaceAll(initialString: string, search: string, replacement: string) {
    return initialString.replace(new RegExp(search, 'g'), replacement);
}