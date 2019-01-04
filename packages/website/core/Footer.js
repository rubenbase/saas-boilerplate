/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Product</h5>
            <a href={this.docUrl('doc1.html', this.props.language)}>Pricing</a>
            <a href={this.docUrl('doc2.html', this.props.language)}>
              Changelog
            </a>
            <a href={this.docUrl('doc3.html', this.props.language)}>
              Status page
            </a>
          </div>

          <div>
            <h5>About</h5>
            <a href="https://github.com/">About us</a>
            <a href="https://github.com/">Privacy Policy</a>
            <a href="https://github.com/">Terms of Service</a>
          </div>
          <div>
            <h5>Resources</h5>
            <a href="https://github.com/">API</a>
            <a href="https://github.com/">Support</a>
            <a href="https://github.com/">Email Contact</a>
          </div>
          <div>
            <h5>Social</h5>
            <a href="/blog">{this.props.config.title} Blog</a>
            <a
              href={`https://twitter.com/${this.props.config.twitterUsername}`}
            >
              Twitter
            </a>
            <a href={this.props.config.linkedinUrl}>Linkedin</a>
          </div>
        </section>

        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
