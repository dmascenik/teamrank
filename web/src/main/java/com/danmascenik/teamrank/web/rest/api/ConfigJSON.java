package com.danmascenik.teamrank.web.rest.api;

public class ConfigJSON {

  private String version = "1.0";

  public ConfigJSON() {

  }

  public ConfigJSON(String version) {
    this.version = version;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

}
