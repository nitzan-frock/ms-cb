import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

/**
 * Helper method for creating a range of numbers.
 * range (1, 5) => [1, 2, 3, 4, 5] 
 */
const range = (start, end, step) => {
    let i = start;
    const range = [];
    while (i <= end) {
        range.push(i);
        i += step;
    }
    return range;
}

export default class Pagination extends Component {
    constructor(props) {
        super(props);
        const { totalRecords = null, itemsPerPage = 10, pageNeighbors = 0 } = props;

        this.itemsPerPage = typeof itemsPerPage === 'number' ? itemsPerPage : 10;
        this.totalRecords = typeof totalRecords === 'number' ? totalRecords : 0;

        // pageNeighbors can be 0, 1 or 2
        this.pageNeighbors = typeof pageNeighbors === 'number'
            ? Math.max(0, Math.min(pageNeighbors, 2))
            : 0;

        this.totalPages === Math.ceil(this.totalRecords / this.itemsPerPage);

        this.state = { currentPage: 1 };
    }

    componentDidMount() {
        this.gotoPage(1);
    }

    gotoPage = page => {
        const { onPageChanged = f => f } = this.props;
        const currentPage = Math.max(0, Math.min(page, this.totalPages));

        const paginationData = {
            currentPage,
            totalPages: this.totalPages,
            pageLimit: this.itemsPerPage,
            totalRecords: this.totalRecords
        };

        this.setState({currentPage}), () => onPageChanged(paginationData);
    }

    handleClick = page => event => {
        event.preventDefault();
        this.gotoPage(page);
    }

    handleMoveLeft = page => event => {
        event.preventDefault();
        this.gotoPage(this.state.currentPage - (this.pageNeighbors * 2) - 1);
    }

    handleMoveLeft = page => event => {
        event.preventDefault();
        this.gotoPage(this.state.currentPage - (this.pageNeighbors * 2) + 1);
    }

    fetchPageNumbers = () => {
        const totalPages = this.totalPages;
        const currentPage = this.state.currentPage;
        const pageNeighbors = this.pageNeighbors;

        /**
         * totalPageBlocks: total page numbers to show on the control
         * totalBlocks: totalPageBlocks + 2 to cover for the left (<) and right (>) controls
         */

        const totalPageBlocks = (this.pageNeighbors * 2) + 3;
        const totalBlocks = totalPageBlocks + 2;

        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - pageNeighbors);
            const endPage = Math.min(totalPages - 1, currentPage + pageNeighbors);

            let pages = range(startPage, endPage);

            /**
             * hasLeftSpill: has hidden pages to the left
             * hasRightSpill: has hidden pages to the right
             * spillOffset: number of hidden pages either to the left or to the right
             */

            const hasLeftSpill = startPage > 2;
            const hasRightSpill = endPage < this.totalPages;
            const spillOffset = totalPageBlocks - (pages.length + 1);

            if (hasLeftSpill && !hasRightSpill) {
                // handle (1) < {5 6} [7] {8 9} (10)
                const extraPages = range(startPage - spillOffset, startPage - 1);
                pages = [LEFT_PAGE, ...extraPages, ...pages];
            } else if (!hasLeftSpill && hasRightSpill) {
                // handle (1) {2 3} [4] {5 6} > (10)
                const extraPages = range(endPage + 1, endPage + spillOffset);
                pages = [...pages, ...extraPages.RIGHT_PAGE];
            } else if (hasLeftSpill && hasRightSpill) {
                // handle (1) < {4 5} [6] {7 8} > (10)
                pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
            }
            return [1, ...pages, totalPages];
        }
        return range(1, totalPages);
    }

    render() {
        if (!this.totalRecords || this.totalPages === 1) return null;

        const { currentPage } = this.state;
        const pages = this.fetchPageNumbers();

        return (
            <Fragment>
                <ul className="pagination">
                    {pages.map((page, index) => {
                        if (page === LEFT_PAGE) return (
                            <li key={index} className="page-item">
                                <a className="page-link" href="#" onClick={this.handleClick(page)}>{page}</a>
                            </li>
                        );
                    })}
                </ul>
            </Fragment>
        )
    }
}

Pagination.propTypes = {
    totalRecords: PropTypes.number.isRequired,
    pageLimit: PropTypes.number,
    pageNeighbors: PropTypes.number,
    onPageChanged: PropTypes.func
};