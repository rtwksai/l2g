import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { Box, Button } from "@material-ui/core";

const useViewStyles = makeStyles({
  root: {}
});

const useItemStyles = makeStyles(theme => ({
  root: {
    "& > .MuiTreeItem-content > .MuiTreeItem-label": {
      display: "flex",
      alignItems: "center",
      padding: "4px 0",
      background: "transparent !important",
      pointerEvents: "none"
    },
    "& > .MuiTreeItem-content  > .MuiTreeItem-label::before": {
      content: "''",
      display: "inline-block",
      width: 12,
      height: 12,
      marginRight: 8,
      border: "1px solid #ccc",
      background: "white"
    }
  },
  iconContainer: {
    marginRight: 12,
    "& > svg": {
      padding: 8,
      "&:hover": {
        opacity: 0.6
      }
    }
  },
  label: {
    padding: 0
  },
  selected: {
    "& > .MuiTreeItem-content  > .MuiTreeItem-label::before": {
      background: theme.palette.primary.main,
      border: "1px solid transparent"
    }
  }
}));

export default function ControlledTreeView() {
  const classesView = useViewStyles();
  const classesItem = useItemStyles();

  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);


  const handleToggle = (event, nodeIds) => {
    if (event.target.nodeName !== "svg") {
      return;
    }
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    if (event.target.nodeName === "svg") {
      return;
    }
    const first = nodeIds[0];
    if (selected.includes(first)) {
      setSelected(selected.filter(id => id !== first));
    } else {
      setSelected([first, ...selected]);
    }
  };

  const read_sql_data = JSON.parse(window.localStorage.getItem("sql_data"))['data'];

  // console.log(read_sql_data);

  const getColumns = (dict_col_data) => {
    let label_ = dict_col_data['column_name'];
    return <TreeItem classes={classesItem} nodeId={label_} label={label_} />
  }

  const getTables = (dict_table_data) => {
    // console.log(dict_table_data);
    // console.log(Object.keys(dict_table_data));
    let label_table_name = Object.keys(dict_table_data)[0];

    const to_be_returned = dict_table_data[label_table_name].map(getColumns);
    return (
      <TreeItem classes={classesItem} nodeId={label_table_name} label={label_table_name} >
        {to_be_returned}
      </TreeItem>
    )
  }



  const sellectAll = (event) => {
    read_sql_data["database"].map((t) => {
      const name = t[0];
      if (selected.includes(name)) {
        setSelected(selected.filter(id => id !== name));
      } else {
        setSelected([name, ...selected]);
      }
      t[name].map((c) => {

        const namec = c[0];
        if (selected.includes(namec)) {
          setSelected(selected.filter(id => id !== namec));
        } else {
          setSelected([namec, ...selected]);
        }
      })

    })
  }







  // let all_elements = [];





  // for(var table_name in read_sql_data) 
  //   {
  //     console.log(table_name);

  //     all_elements.push(<TreeItem classes={classesItem} nodeId="2" label={table_name} >);
  //     for(var column_name in read_sql_data[table_name])
  //     {
  //       console.log(read_sql_data[table_name][column_name]);

  //       all_elements.push(<TreeItem classes={classesItem} nodeId="1" label={read_sql_data[table_name][column_name]}/>);

  //     }
  //     all_elements.push(</TreeItem >);

  //   }

  // console.log(read_sql_data['database'][0]['table1'].map(getColumns));

  return (



    <Box>
      <Button type="button" onClick={sellectAll}>Sellect All </Button>
      <TreeView
        classes={classesView}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        multiSelect
      >
        {read_sql_data['database'].map(getTables)}
        {/* <TreeItem classes={classesItem} nodeId="1" label="Table 1">
        <TreeItem classes={classesItem} nodeId="2" label="Col 1" />
        <TreeItem classes={classesItem} nodeId="3" label="Col 2" />
        <TreeItem classes={classesItem} nodeId="4" label="Col 3" />
      </TreeItem>
      <TreeItem classes={classesItem} nodeId="5" label="Table 2">
        <TreeItem classes={classesItem} nodeId="6" label="Material-UI">
          <TreeItem classes={classesItem} nodeId="7" label="src">
            <TreeItem classes={classesItem} nodeId="8" label="index.js" />
            <TreeItem classes={classesItem} nodeId="9" label="tree-view.js" />
          </TreeItem>
        </TreeItem>
      </TreeItem> */}
      </TreeView>
    </Box>
  );
}