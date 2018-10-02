import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import './pagination.scss';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

/**
 * Helper method for creating a range of numbers.
 * range (1, 5) => [1, 2, 3, 4, 5] 
 */
const range = (start, end, step = 1) => {
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

        this.totalPages = Math.ceil(this.totalRecords / this.itemsPerPage);
        console.log('total pages: ' + this.totalPages);

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
            itemsPerPage: this.itemsPerPage,
            totalRecords: this.totalRecords
        };

        this.setState({currentPage}, () => onPageChanged(paginationData));
    }

    handleClick = (page, event) => {
        event.preventDefault();
        this.gotoPage(page);
    }

    handleMoveLeft = event => {
        event.preventDefault();
        const offset = this.pageNeighbors * 2 + 1;
        this.gotoPage(this.state.currentPage - offset);
    }

    handleMoveRight = event => {
        event.preventDefault();
        const offset = this.pageNeighbors * 2 + 1;
        this.gotoPage(this.state.currentPage + offset);
    }

    fetchPageNumbers = () => {
        const totalPages = this.totalPages;
        const currentPage = this.state.currentPage;
        const pageNeighbors = this.pageNeighbors;

        const totalPageBlocks = (this.pageNeighbors * 2) + 3;
        const totalBlocks = totalPageBlocks + 2;

        if (totalPages > totalBlocks) {
            let pages = [];

            const leftBound = currentPage - pageNeighbors;
            const rightBound = currentPage + pageNeighbors;
            const beforeLastPage = totalPages - 1;

            const startPage = leftBound > 2 ? leftBound : 2;
            const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;
            pages = range(startPage, endPage);

            const pagesCount = pages.length;

            const hasLeftSpill = startPage > 2;
            const hasRightSpill = endPage < beforeLastPage;
            const spillOffset = totalPageBlocks - pagesCount - 1;
            const leftSpillControl = LEFT_PAGE;
            const rightSpillControl = RIGHT_PAGE;

            if (hasLeftSpill && !hasRightSpill) {
                // handle (1) < {5 6} [7] {8 9} (10)
                const extraPages = range(startPage - spillOffset, startPage - 1);
                pages = [leftSpillControl, ...extraPages, ...pages];
            } else if (!hasLeftSpill && hasRightSpill) {
                // handle (1) {2 3} [4] {5 6} > (10)
                const extraPages = range(endPage + 1, endPage + spillOffset);
                pages = [...pages, ...extraPages, rightSpillControl];
            } else if (hasLeftSpill && hasRightSpill) {
                // handle (1) < {4 5} [6] {7 8} > (10)
                pages = [leftSpillControl, ...pages, rightSpillControl];
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
                <p>choose page</p>
                <ul className="pagination">
                    {pages.map((page, index) => {
                        if (page === LEFT_PAGE) return (
                                <li key={index} className="page-item">
                                    <a 
                                        className="page-link" 
                                        href="#" 
                                        onClick={this.handleMoveLeft}>&laquo;</a>
                                </li>
                        );
                        if (page === RIGHT_PAGE) return (
                            <li key={index} className="page-item">
                                <a
                                    className="page-link"
                                    href="#"
                                    onClick={this.handleMoveRight}>&raquo;</a>
                            </li>
                        );
                        return (
                            <li key={index} className={`page-item ${
                                    currentPage === page ? "active": ""
                                }`}>
                                <a 
                                    className="page-link"
                                    href="#"
                                    onClick={e => this.handleClick(page, e)}>{page}</a>
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
    itemsPerPage: PropTypes.number,
    pageNeighbors: PropTypes.number,
    onPageChanged: PropTypes.func
};