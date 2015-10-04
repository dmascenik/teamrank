package com.danmascenik.teamrank.web.rest.api;

public class AboutJSON {

  private String version;

  public AboutJSON() {

  }

  public AboutJSON(String version) {
    this.version = version;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

}
