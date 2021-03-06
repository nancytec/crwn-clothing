import React from 'react';
import { Route } from 'react-router-dom';

import CollectionsOverview from '../../components/collections-overview/collections-overview.component';
import CollectionPage from '../collection/collection.component';
import { firestore , convertCollectionsSnapShotToMap } from "../../firebase/firebase.utils";
import { connect } from 'react-redux';
import {updateCollections} from "../../redux/shop/shop.actions";
import WithSpinner from "../../components/with-spinner/with-spinner.component";

const CollectionsOverviewWithSpinner = WithSpinner(CollectionsOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

class ShopPage extends React.Component{
    state = {
        loading: true,
    }
    unsubscribeFromSnapshot = null;

    componentDidMount() {
        const { updateCollections } = this.props;
        const collectionRef = firestore.collection('collections');


        //Wit firebase fetch method
        //Wit live update
        // collectionRef.onSnapshot(async snapshot => {
        //     const collectionMap = convertCollectionsSnapShotToMap(snapshot);
        //     updateCollections(collectionMap); //Passing the firestore data to redux
        //     this.setState({loading: false});
        // });

        //witout firebase fetch method
        //No live update
        collectionRef.get().then(snapshot => {
            const collectionMap = convertCollectionsSnapShotToMap(snapshot);
            updateCollections(collectionMap); //Passing the firestore data to redux
            this.setState({loading: false});
        });

    }

    render() {
        const { match } = this.props;
        const { loading } = this.state;
        return (
            <div className='shop-page'>
                <Route exact path={`${match.path}`} render={(props) => <CollectionsOverviewWithSpinner isLoading={loading} {...props} />} />
                <Route path={`${match.path}/:collectionId`} render={(props) => <CollectionPageWithSpinner isLoading={loading} {...props} />} />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    updateCollections: collectionMap =>
        dispatch(updateCollections(collectionMap))
});

export default connect(null, mapDispatchToProps)(ShopPage);
