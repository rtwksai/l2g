import React from "react";
import './css/styles.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formValues: [{ db1: "", table1: "", column1: "", db2: "", table2: "", column2: ""  }]
        };
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(i, e) {
        let formValues = this.state.formValues;
        formValues[i][e.target.name] = e.target.value;
        this.setState({ formValues });
    }

    addFormFields() {
        this.setState(({
            formValues: [...this.state.formValues, { db1: "", table1: "", column1: "", db2: "", table2: "", column2: ""  }]
        }))
    }

    removeFormFields(i) {
        let formValues = this.state.formValues;
        formValues.splice(i, 1);
        this.setState({ formValues });
    }

    handleSubmit(event) {
        event.preventDefault();
        alert(JSON.stringify(this.state.formValues));
    }

    render() {

        return (
            <form onSubmit={this.handleSubmit}>
                {this.state.formValues.map((element, index) => (
                    <div className="form-inline" key={index}>
                        <div className="form-dropdown">
                            <label>DB1</label>
                            <input type="text" name="db1" value={element.db1 || ""} onChange={e => this.handleChange(index, e)} />
                            <label>Table1</label>
                            <input type="text" name="table1" value={element.table1 || ""} onChange={e => this.handleChange(index, e)} />
                            <label>Column1</label>
                            <input type="text" name="column1" value={element.column1 || ""} onChange={e => this.handleChange(index, e)} />
                            <label>DB2</label>
                            <input type="text" name="db2" value={element.db2 || ""} onChange={e => this.handleChange(index, e)} />
                            <label>Table2</label>
                            <input type="text" name="table2" value={element.table2 || ""} onChange={e => this.handleChange(index, e)} />
                            <label>Column2</label>
                            <input type="text" name="column2" value={element.column2 || ""} onChange={e => this.handleChange(index, e)} />
                        </div>

                        {
                            index ?
                                <button type="button" className="button remove" onClick={() => this.removeFormFields(index)}>Remove</button>
                                : null
                        }
                    </div>
                ))}
                <div className="button-section">
                    <button className="button add" type="button" onClick={() => this.addFormFields()}>Add</button>
                    <button className="button submit" type="submit">Submit</button>
                </div>
            </form>
        );
    }
}
export default App;