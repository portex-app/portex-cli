Init your environment:      
        login <token>                     login to your portex account

Manage application deployment:
        new                               create new application (input app-name,app-description, platform-select)
        ls                                get application list (list app-name, app-id, platform-name, last-version)
        deploy <app-name> <path>          deploy application, upload application package from application build path.

Manage application:
        publish <app-name> <version>      publish application (block application, set version 0)
                -e, --env=<option>  <option: prod|dev|test> <default: dev> 

        rename <app-name> <new-app-name>  rename application (WIP)
        
Other:
        autocomplete [SHELL]
        help [COMMAND]