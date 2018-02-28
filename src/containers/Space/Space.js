import { connect } from 'react-redux';
import { withCanvas } from '../../helpers/Canvas';
import { MapNavigation } from '../../helpers/MapNavigation';
import Space from '../../components/Space/Space';
import { changeRotation } from '../../actions/map';

const mapStateToProps = ({ map }) => ({
  projectionType: map.projectionType,
  mapType: map.mapType,
  scale: map.scale,
  rotation: map.rotation,
});
const mapDispatchToProps = dispatch => ({
  changeRotation: rotation => dispatch(changeRotation(rotation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withCanvas(MapNavigation(Space)));
