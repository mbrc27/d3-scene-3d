import { connect } from 'react-redux';
import App from '../../components/App/App';
import { fetchData } from '../../actions/data';
import { zoomIn, zoomOut } from '../../actions/map';

const mapStateToProps = ({ data, map }) => ({
  projectionType: map.projectionType,
  topoJSON: data,
});
const mapDispatchToProps = dispatch => ({
  fetchData: fetchData(dispatch),
  zoomIn: () => dispatch(zoomIn()),
  zoomOut: () => dispatch(zoomOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
