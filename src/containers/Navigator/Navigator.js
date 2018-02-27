import { connect } from 'react-redux';
import Navigator from '../../components/Navigator/Navigator';
import {
  changeMapType,
  changeProjection,
  changeRotation,
  zoomIn,
  zoomOut,
} from '../../actions/map';

const mapStateToProps = ({ map }) => ({
  projectionType: map.projectionType,
  mapType: map.mapType,
});
const mapDispatchToProps = dispatch => ({
  changeMapType: ({ target }) => dispatch(changeMapType(target.value)),
  changeProjection: ({ target }) => dispatch(changeProjection(target.value)),
  restoreRotation: () => dispatch(changeRotation([0, 0])),
  zoomIn: () => dispatch(zoomIn()),
  zoomOut: () => dispatch(zoomOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);
