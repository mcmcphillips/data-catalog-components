import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import PublisherDatasetCountByName from "../PublisherDatasetCountByName";
import axios from 'axios';

function Organization(props) {
  const { name,
          description,
          imageUrl,
          searchUrl,
          alignment,
          organizationEndpoint} = props;

  const image = <img alt={name || 'Organization Image'} src={imageUrl} />;
  const link = searchUrl ? searchUrl : `/search/?publisher__name=${name}`;
  const [dataObj, setDataObj] = useState();

  const fetchData = async () => {
    const endpoint = organizationEndpoint ? organizationEndpoint.replace("api/1", "data.json") : null;
    if (endpoint) {
      axios.get(endpoint)
        .then(res => (setDataObj(res.data)))
        .catch(err => (console.log("Error, check URL/Cors.", err)));
    } else {
      console.log("No search endpoint defined for Organization/s, so no dataset info available.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dc-org-block" style={{ textAlign: alignment }}>
      <Link to={link} className="dc-org-image" alt="Organization Logo">
        {image}
        <h3 className="dc-org-name">
          {name}
        </h3>
      </Link>
      {description && (
        <div className="dc-org-description">
          {description}
        </div>
      )}

      {dataObj && dataObj.dataset !== 'undefined' ?
       <PublisherDatasetCountByName
         name={name}
         datasetCount={
           countDatasetsByName(name, dataObj.dataset)
         } /> :
       <PublisherDatasetCountByName name={name} />
      }
    </div>
  );
}

export const countDatasetsByName = (publisher, datasets) =>  {
  const publishers = datasets.map((data, index, arr) => {return data.publisher; });
  const result =  publishers.filter((p) => {return p.name === publisher;});
  if (typeof result !== 'undefined' && result.length) {
    return result.length;

  }
  return null;
};

Organization.defaultProps = {
  alignment: "center",
  name: "",
  description: "",
  imageUrl: "https://s3.amazonaws.com/dkan-default-content-files/files/group.png",
};

Organization.propTypes = {
  alignment: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  searchUrl: PropTypes.string,
  organizationEndpoint: PropTypes.string,
};

export default Organization;
