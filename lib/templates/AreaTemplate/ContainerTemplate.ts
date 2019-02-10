export default
`import * as React from 'react';
import './{{ENTITY_NAME_PASCAL}}.less';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';

export interface I{{ENTITY_NAME_PASCAL}}ContainerProps extends RouteComponentProps<any> {
    
}


@inject()
@observer
class {{ENTITY_NAME_PASCAL}}Container extends React.Component<I{{ENTITY_NAME_PASCAL}}ContainerProps> {
    
    render() {
        const {} = this.props;
        
        return (
            <div id="{{ENTITY_NAME_PASCAL}}Container">
                
            </div>
        )
    }
}

export default withRouter({{ENTITY_NAME_PASCAL}}Container);`;

export const styles =
`@import '../../global/styles/variables';

#{{ENTITY_NAME_PASCAL}}Container {

}`;