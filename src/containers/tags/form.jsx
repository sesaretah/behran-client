import React from "react";
import { List, ListItem, ListInput, Block, Row, Button, BlockTitle } from 'framework7-react';
import { dict } from '../../Dict';
import crypto from 'crypto-js';


const TagForm = (props) => {
  if (props.defaultTag) {
    var isDefaultTag = true;
  } else {
    var isDefaultTag = false
  }
  return (
    <React.Fragment>
      <BlockTitle>{dict.tag}</BlockTitle>
      <List form>
        <ListInput
          label={dict.title}
          type="text"
          placeholder='...'
          defaultValue={props.tag.title}
          onInput={(e) => {
            props.handleChange({ title: e.target.value })
          }}
        />
      </List>

      <Block strong>
        <Row tag="p">
          <Button className="col" fill disabled={!props.editing} onClick={props.submit}>{dict.submit}</Button>
        </Row>
      </Block>
    </React.Fragment>
  )
}
export default TagForm;