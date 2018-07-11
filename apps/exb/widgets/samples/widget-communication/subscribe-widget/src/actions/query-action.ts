import {MessageAction, MessageType, Message, store, appActions, StringSelectionChangeMessage} from 'jimu-core';

interface Config{
  fieldName: string;
}
export default class QueryAction extends MessageAction{
  filterMessageType(messageType: MessageType): boolean{
    return messageType === MessageType.StringSelectionChange;
  }

  filterMessage(message: Message): boolean{return true;}

  onExecute(message: Message, actionConfig?: any): Promise<boolean> | boolean{
    let q = `${(actionConfig as Config).fieldName} = '${message}'`
    switch(message.type){
      case MessageType.StringSelectionChange:
        q = `${(actionConfig as Config).fieldName} = '${(message as StringSelectionChangeMessage).str}'`
    }
    
    store.dispatch(appActions.widgetStatePropChange(this.widgetId, 'queryString', q));
    return true;
  }
}