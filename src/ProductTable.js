import React, {Component, Fragment} from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';

class ProductTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHeaders: [],
      rows: [],
    };

    this.renderHeaders = this.renderHeaders.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await axios.get('/data/table_data.json');
      const data = response.data;
      //React doesn't allow mutating state in the arrays directly, so we have to join an empty array with
      //an array containing data and then pass it as a const
      const headers = this.state.tableHeaders.concat(Object.keys(data[1]));

      this.setState({
        tableHeaders: headers,
        rows: Object.values(data),
      });
    } catch (error) {
      console.error(error);
    }
  }

  renderHeaders() {
    const headers = this.state.tableHeaders;

    return headers.map(header => {
      return <th key={header}>{header}</th>;
    });
  }

  renderTableData() {
    const rows = this.state.rows;

    return rows.slice(0, 60).map((item, index) => {
      //We want to iterate and display all values of each property.
      //In order to map it, we have to convert it to an object first, otherwise we'll get an error
      let record = Object.assign({}, rows[index]);

      //a regex test to check if something is a link so we can trim the string
      let linkTest = new RegExp('^(http|https)://.*$');

      return (
        <tr key={item.id}>
          {Object.values(record).map(property => {
            if (linkTest.test(property) === true || property.length > 25) {
              return (
                <td key={Math.random()}>{property.substring(0, 24) + '...'}</td>
              );
            } else {
              return <td key={Math.random()}>{property}</td>;
            }
          })}
        </tr>
      );
    });
  }

  render(options) {
    options = this.state.headers;

    return (
      <Fragment>
        <h1 className="title">ProductsUp Task</h1>
        <div className="table">
          <Table>
            <thead className="thead-dark">
              <tr>{this.renderHeaders()}</tr>
            </thead>
            <tbody>{this.renderTableData()}</tbody>
          </Table>

          
        </div>
      </Fragment>
    );
  }
}

export default ProductTable;
