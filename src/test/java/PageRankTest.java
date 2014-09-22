
import org.junit.Test;

public class PageRankTest {

  float[][] hSample = new float[][] { {1, 0, 0}, {0, 0, 0}, {1, 1, 0}};

  @Test
  public void testMakeStochastic() {
    float[][] s = PageRank.makeStochastic(hSample);
    PageRank.printMatrix(s);
  }

}
