import Ractive from 'ractive';
import template from './issues.ract';

export default Ractive.extend({
  template: template.template,
  data: () => ({
    issue: [],
    loading: true
  })
});
