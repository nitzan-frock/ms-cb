import SectionFactory from './SectionFactory';

const Section = (props) => {
    return SectionFactory.build(props);
};

export default Section;