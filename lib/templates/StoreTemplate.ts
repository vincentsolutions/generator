export default
`import {action, computed, observable, runInAction} from "mobx";
import {{ENTITY_NAME_PASCAL}} from "../models/{{ENTITY_NAME_PASCAL}}";
import {ApiError} from "../models/Errors";
import {{ENTITY_NAME_PASCAL}}sApi from "../../api/{{ENTITY_NAME_PASCAL}}sApi";
import BaseStore from "./BaseStore";

export class {{ENTITY_NAME_PASCAL}}Store extends BaseStore {

    // MARK: Observable Properties
    @observable public {{ENTITY_NAME_CAMEL}}s: {{ENTITY_NAME_PASCAL}}[] = [];

    // MARK: Actions
    @action
    load{{ENTITY_NAME_PASCAL}}s = async () => {
        this.isLoading = true;

        let {{ENTITY_NAME_CAMEL}}s = await {{ENTITY_NAME_PASCAL}}sApi.get{{ENTITY_NAME_PASCAL}}s();

        runInAction(() => {
            this.{{ENTITY_NAME_CAMEL}}s = {{ENTITY_NAME_CAMEL}}s;
            this.isLoading = false;
        })
    };

    @action
    get{{ENTITY_NAME_PASCAL}}ById = (id: string) => {
        return this.{{ENTITY_NAME_CAMEL}}s.find(x => x.id === id);
    };

    @action
    get{{ENTITY_NAME_PASCAL}}IndexById = (id: string) => {
        return this.{{ENTITY_NAME_CAMEL}}s.findIndex(x => x.id === id);
    };

    @action
    add{{ENTITY_NAME_PASCAL}} = async ({{ENTITY_NAME_CAMEL}}: {{ENTITY_NAME_PASCAL}}) => {
        this.isLoading = true;
        this.resetApiErrors();

        try {
            const result = await {{ENTITY_NAME_PASCAL}}sApi.add{{ENTITY_NAME_PASCAL}}({{ENTITY_NAME_CAMEL}});

            runInAction(() => {
                this.{{ENTITY_NAME_CAMEL}}s.push(result);
                this.isLoading = false;
            });
        } catch(err) {
            if (err instanceof ApiError) {
                this.saveError(err);
                return;
            }

            throw err;
        }
    };

    @action
    update{{ENTITY_NAME_PASCAL}} = async (id: string, {{ENTITY_NAME_CAMEL}}: Partial<{{ENTITY_NAME_PASCAL}}>) => {
        const index = this.get{{ENTITY_NAME_PASCAL}}IndexById(id);

        if (index >= 0) {
            this.isLoading = true;
            this.resetApiErrors();

            try {
                const result = await {{ENTITY_NAME_PASCAL}}sApi.update{{ENTITY_NAME_PASCAL}}(id, {{ENTITY_NAME_CAMEL}});

                runInAction(() => {
                    this.{{ENTITY_NAME_CAMEL}}s[index] = result;
                    this.isLoading = false;
                });
            } catch (err) {
                if (err instanceof ApiError) {
                    this.saveError(err);
                    return;
                }

                throw err;
            }
        }
    };

    @action
    remove{{ENTITY_NAME_PASCAL}} = async (id: string) => {
        const index = this.get{{ENTITY_NAME_PASCAL}}IndexById(id);

        if (index >= 0) {
            this.isLoading = true;
            this.resetApiErrors();

            try {
                await {{ENTITY_NAME_PASCAL}}sApi.remove{{ENTITY_NAME_PASCAL}}(id);

                runInAction(() => {
                    this.{{ENTITY_NAME_CAMEL}}s.splice(index, 1);
                    this.isLoading = false;
                });
            } catch (err) {
                if (err instanceof ApiError) {
                    this.saveError(err);
                    return;
                }

                throw err;
            }
        }
    };

    // MARK: Computed Properties
    @computed
    get {{ENTITY_NAME_CAMEL}}sCount() {
        return this.{{ENTITY_NAME_CAMEL}}s.length;
    }
}

const {{ENTITY_NAME_CAMEL}}Store = new {{ENTITY_NAME_PASCAL}}Store();

export default {{ENTITY_NAME_CAMEL}}Store;`