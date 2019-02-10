export default
`import {{ENTITY_NAME_PASCAL}} from "../data/models/{{ENTITY_NAME_PASCAL}}";
import BaseApi from "./BaseApi";
import {HttpMethod} from "../global/classes/Enums";

class {{ENTITY_NAME_PASCAL}}sApi extends BaseApi {
    static resourceName = "{{ENTITY_NAME_CAMEL}}s";

    static async get{{ENTITY_NAME_PASCAL}}s() {
        return this.sendApiRequest<{{ENTITY_NAME_PASCAL}}[]>(HttpMethod.GET, {{ENTITY_NAME_PASCAL}}sApi.resourceName)
            .catch(error => {
                console.log(error);
                return [] as {{ENTITY_NAME_PASCAL}}[];
            })
    }

    static async get{{ENTITY_NAME_PASCAL}}(id: string) {
        return this.sendApiRequest<{{ENTITY_NAME_PASCAL}}>(HttpMethod.GET, {{ENTITY_NAME_PASCAL}}sApi.resourceName, undefined, id);
    }

    static async add{{ENTITY_NAME_PASCAL}}({{ENTITY_NAME_PASCAL}}: {{ENTITY_NAME_PASCAL}}) {
        return this.sendApiRequest(HttpMethod.POST, {{ENTITY_NAME_PASCAL}}sApi.resourceName, {{ENTITY_NAME_PASCAL}});
    }

    static async update{{ENTITY_NAME_PASCAL}}(id: string, {{ENTITY_NAME_PASCAL}}: Partial<{{ENTITY_NAME_PASCAL}}>) {
        return this.sendApiRequestWithResult<Partial<{{ENTITY_NAME_PASCAL}}>, {{ENTITY_NAME_PASCAL}}>(HttpMethod.PUT, {{ENTITY_NAME_PASCAL}}sApi.resourceName, {{ENTITY_NAME_PASCAL}}, id);
    }

    static async remove{{ENTITY_NAME_PASCAL}}(id: string) {
        return this.sendApiRequest<null>(HttpMethod.DELETE, {{ENTITY_NAME_PASCAL}}sApi.resourceName, undefined, id);
    }
}

export default {{ENTITY_NAME_PASCAL}}sApi;`